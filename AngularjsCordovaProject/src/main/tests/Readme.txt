Running the Karma unit tests.

Karma/Jasmine is a command line tool that will run all unit tests meeting the pattern identified in the karma.conf.js file.

To run the tests, navigate a command line to this location, and run 'karma start'.

The karma.conf.js file is configured to run the test only once (it has an option continuous mode that monitors changes).

If successful, the unit test will present a browser instance, and run the tests, once complete the karma framework will
tear the instance of the browser down, and present the results in a color coded command line status.

After the unit tests are run, a coverage directory is created just beneath the PPOS directory - and if the index.html file
is opened in a browser, it will display the code coverage currently achieved by the tests.


Enjoy !

