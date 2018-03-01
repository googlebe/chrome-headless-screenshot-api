const CDP = require('chrome-remote-interface');
const file = require('fs');

async function screenshot(config, params, callback) {
  console.log('Taking screenshot', params);

  const chromeConfig = config.chrome;

  const tab = await CDP.New(chromeConfig);
  const client = await CDP({
    tab
  });

  const {
    DOM,
    Emulation,
    Network,
    Page,
    Runtime,
    Target
  } = client;
  await Page.enable();
  await Network.enable();

  // If user agent override was specified, pass to Network domain
  if (params.ua) {
    await Network.setUserAgentOverride({
      userAgent: params.ua
    });
  }

  // Set up viewport resolution, etc.
  const deviceMetrics = {
    width: params.width,
    height: params.height,
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false,
  };
  await Emulation.setDeviceMetricsOverride(deviceMetrics);
  await Emulation.setVisibleSize({
    width: params.width,
    height: params.height
  });

  // Navigate to target page
  await Page.navigate({
    url: params.url
  });
  // Wait for page load event to take screenshot
  Page.loadEventFired(async() => {
    // If the `full` params was passed, we need to measure the height of
    // the rendered page and use Emulation.setVisibleSize
    if (params.full) {
      const {
        root: {
          nodeId: documentNodeId
        }
      } = await DOM.getDocument();
      const {
        nodeId: bodyNodeId
      } = await DOM.querySelector({
        selector: 'body',
        nodeId: documentNodeId,
      });
      const {
        model: {
          height
        }
      } = await DOM.getBoxModel({
        nodeId: bodyNodeId
      });

      await Emulation.setVisibleSize({
        width: params.width,
        height: height
      });
    }
    setTimeout(async function(res) {
      const screenshot = await Page.captureScreenshot({
        format: params.format
      });
      const buffer = new Buffer(screenshot.data, 'base64');
      callback.success({
        'buffer': buffer
      });
      client.send('Target.closeTarget', {targetId: tab.id});
      client.send('Network.clearBrowserCookies');
      client.close();
    }, params.delay);
  });
}

module.exports = {
  screenshot: screenshot
};
