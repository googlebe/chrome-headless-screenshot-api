const execFile = require('child_process').execFile;
var ps = require('ps-node');

function launchHeadless(config) {
	killProcesses(config);
	console.log('Starting Chrome headless.');
  	execFile(config.chrome.exec, ['--headless', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + config.chrome.debug_options.port], (error, stdout, stderr) => {
	    if (error) {
	        console.error('stderr', stderr);
	        throw error;
	    }
	});
}

function killProcesses(config) {
	ps.lookup({
	    command: 'chrome',
	    }, function(err, resultList ) {

	    resultList.forEach(function( process ){
	        if( process ){
	            ps.kill( process.pid, 'SIGKILL', function( err ) {
				    console.log( 'Attempted to kill PID: %s Command: %s.', process.pid, process.command );
				});
	        }
	    });
});
}
module.exports = {
    launchHeadless: launchHeadless
};