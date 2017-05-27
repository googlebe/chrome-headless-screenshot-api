const CDP = require('chrome-remote-interface');
const file = require('fs');

async function screenshot(config, params, callback) {
  console.log('Taking screenshot', params);

  const options = config.chrome.debug_options;

  const tab = await CDP.New(options);
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
  await DOM.enable();
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
      // This forceViewport call ensures that content outside the viewport is
      // rendered, otherwise it shows up as grey. Possibly a bug?
      await Emulation.forceViewport({
        x: 0,
        y: 0,
        scale: 1
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
      await CDP.Close({
          id: tab.id
        })
        // List open tabs
        /*
        CDP.List(function(err, targets) {
            console.log(targets);
        });
        */
      client.close();
    }, params.delay);
  });
}

module.exports = {
  screenshot: screenshot
};
