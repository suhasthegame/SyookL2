This application is created based on the specification provided in the assignment problem. 
Highlighting all the major features implemented.
-> Implemented a Web Socket Server based emitter that emits encryted randomized strings of data (between 49 and 499) separated by |, encrypted using AES 256 algorithm.
-> Implemented a consumer of this data, as the listener which decrypts the data, and checks the integrity of the data using the checksum provided for the data in the form of SHA-256 hash. 
  If the hash matches, the data is considered valid and is bucketed for adding into the Database. 
  Else, if the hash doesn't match, the data is considered corrupted and is discarded.
-> The database is modelled as a timeSeries DB, with the Schema carefully designed to ensure good Aggregration and reduce DB write operations. 
  Data recieved from Emitter every 10s, is bucketed and the data is written into the DB every 60s. 
-> The Client Side of the application has a small user input, where the user can select a timeZone and the records matching that time or before that time is retrieved and sent via Websockets. 
