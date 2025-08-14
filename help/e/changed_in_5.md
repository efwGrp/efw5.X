# What changed in Efw5?

## 1. Changed from Narshorn to Graaljs
- Supported JavaScript version upgraded from ES6 (2015) to ES15 (2024).
- Discarded the global module's loadWithGlobalPool and loadWithNewGlobal functions.
- Recreated Efw functions and modules with JavaScript classes.
- Discarded the NewKeywordWasForgottenException error when the Efw class was not initialized.
- Discarded Threads class.

## 2. Changed to multi-context
- In release mode, all source code in the event js folder is loaded into memory.
- The load function is ignored in release mode.
- The event module's load function is ignored in release mode.
- Content other than Java objects and JSON objects in the session module is ignored.
- Executing heavy processing in the initialization global event is deprecated.

## 3. Removal of features with little proven track record
- db module master function
- barcode module
- TXTReader class
- keepConnectionAlive for maintaining sessions during long-running execution

## 3. Ability to terminate due to changes in related software
- nopromise attribute of Client tag
```
End of support for IE and IE mode
End of support for wkhtmltopdf
```

- brms module and related property settings
```
Shift from runtime use of innorules to RestAPI
```
- server parameter of client function Efw()
```
Enhanced security in various browsers makes it difficult to use CORS
```
- CORS-related property settings
```
Please address this issue using Tomcat's CORS settings.
https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html
```

## 4. Promotion of some internal functions
- load and get functions in the event module
- commit, rollback, commitAll, and rollbackAll functions in the db module

## 5. Functionality adjustments for Vue integration
- Add a provide function to the Result class
- Add a return value for the client Efw function
- Add an addVue attribute to the Client tag