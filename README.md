# Cannabis traceability smartcontracts suite

## Requirements

In order to have aeproject working you must have installed the following:

   ```
   nodejs 9.5.0 
   python 
   docker
   ```

Note: For older versions on widnows you can use docker-toolbox. This will install docker-compose as part of the toolkit. Please bear in mind that the your docker-compose version must be at least @1.20.0 

Note2: If you are willing to use the *fire-editor* aepp locally with *aeproject* you would need to use version not lower to 10.9.0. For more information    check [aeproject fire-editor](developer-documentation/aeproject-cli/fire-editor.md))

## Install


   npm install -g aeproject



## For running origins smart contract test

   1) aeproject env
   2) aeproject compiler
   3) aeproject test

Note: In case of the following error 

      Error: Cannot find module ‘aeproject-utils’

   run 
   
      npm install aeproject-utils prompts aeproject-logger

   And try step 3 again



