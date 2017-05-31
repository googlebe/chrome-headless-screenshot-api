# Chrome Headless Screenshot API

Simple REST API to take screenshots of webpages using Chrome in headless mode.

Demo: [https://screenshot-demo.atslab.io/?url=https://github.com](https://screenshot-demo.atslab.io/?url=https://github.com)

This is a work in progress (see [issues](https://github.com/automatethatshit/chrome-headless-screenshot-api/issues)). Use in production isn't recommended at the moment (although we will be testing using it to power the [ATS screenshot tool](https://automatethatshit.com/lab/website-screenshot)).

Note: The beta version of Chrome is being used for now, because opening new tabs through the remote debugging protocol doesn't work in the stable version of Chrome 59.

## Running Locally

This project provides a simple Vagrantfile that will create a VM running Ubuntu and run a script that installs it's dependencies.

To get started running the API locally, first clone this repository:

	git clone https://github.com/automatethatshit/chrome-headless-screenshot-api.git

Then, in the root of the repository, initialize the Vagrant VM by running:

	vagrant up

Once the VM has booted and the provisioning script has run, ssh into the VM with:

	vagrant ssh

And finally start the API by running:

	node /chrome-headless-screenshot-api/src/runner.js

The Vagrantfile forwards port `3000` on the host machine to port `3000` on the guest. So the API should now be available to you at [127.0.0.1:3000](http://127.0.0.1:3000).

## API Usage

The API has only one route `/`, which accepts both `GET` and `POST` requests.

It accepts the following parameters as part of the query string for `GET` requests, or as URL encoded form parameters or a JSON object for `POST` requests:

**url** (string)

URL to take a screenshot of. This is the only required parameter.

**full** (boolean)

Whether or not to take a screenshot of the entire page or only the region visible without scrolling. Defaults value is `true`.

**format** (string)

Output file format. Accepted values are `jpeg` and `png`. Default value is `jpeg`.

**delay** (integer)

Number of seconds to pause before taking the screenshot. Default value is `2`.

**width** (integer)

Browser width. Default value is `1440`.

**height** (integer)

Browser width. Default value is `900`.

**ua** (string)

User agent override. Default value is `null`.

## Configuration

The configuration file is at `src/config/config.yml`.

It would be nice to be able to overwrite these values somewhere outside of version control, but for now all configuration comes from this file.

TODO: Document configuration parameters.

## Credits

Thanks to [David Schnurr](https://github.com/schnerd) for the Chrome headless screenshot capture code which is the basis of this project, and for the instructions for running Chrome headless on Ubuntu. David's code can be found at [https://github.com/schnerd/chrome-headless-screenshots](https://github.com/schnerd/chrome-headless-screenshots).

Thanks to [Vladislav Bauer](https://github.com/vbauer) and the [contributors](https://github.com/vbauer/manet/graphs/contributors) to his project [Manet](https://github.com/vbauer/manet) (a screenshot REST API around SlimerJS and PhantomJS) which provided inspiration for this project and which its structure draws heavily from. We considered making this a fork of Manet, but ultimately decided not to for a number of reasons but mostly because we didn't plan on supporting all of it's options at the moment. We may consider submitting a pull request to Manet to support Chrome headless at some point in the future. (See: issue [#82](https://github.com/vbauer/manet/issues/82).)

Finally, this project wouldn't be possible without [Andrea Cardaci](https://github.com/cyrus-and) and the [contributors](https://github.com/cyrus-and/chrome-remote-interface/graphs/contributors) to [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface).
