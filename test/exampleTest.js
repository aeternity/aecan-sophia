/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

const Deployer = require('aeproject-lib').Deployer;
const EXAMPLE_CONTRACT_PATH = "./contracts/UruguayCanTrace.aes";
const Universal = require('@aeternity/aepp-sdk').Universal;
const unknowUserContract = utils.readFileRelative('./contracts/UruguayCanTrace.aes', 'utf-8');
describe('Example Contract', () => {

    let deployer;
    let instance;
    let ownerKeyPair = wallets[0];
    let unknowKeyPair = wallets[1];
    let unknowUser;
    let procedureId;
    let procedureName;
    let procedureDescription;
    let procedureType;
    let procedureOrganism;
    let traceContract;
    const config = {
        host: 'http://localhost:3001/',
        internalHost: 'http://localhost:3001/internal/',
        compilerUrl: 'http://localhost:3080'
    };
    before(async () => {
        deployer = new Deployer('local', ownerKeyPair.secretKey)
        unknowUser = await Universal({
            url: config.host,
            internalUrl: config.internalHost,
            keypair: unknowKeyPair,
            nativeMode: true,
            networkId: 'ae_devnet',
            compilerUrl: config.compilerUrl
        });
    })

    it('Deploying Example Contract', async () => {
        const deployedPromise = deployer.deploy(EXAMPLE_CONTRACT_PATH) // Deploy it

        await assert.isFulfilled(deployedPromise, 'Could not deploy the Entities Smart Contract'); // Check whether it's deployed
        instance = await Promise.resolve(deployedPromise)
    })

    it('Adding administrator user', async () => {
        
        await instance.add_admin(ownerKeyPair.publicKey,"Omar Saadoun");

        let exists = (await instance.get_users()).decodedResult
        assert.isOk(exists)
    })
    it('initializing data', async () => {
        
        await instance.initial_configuration();

    })
    it('Should return Measure units', async () => {
        
        let exists = (await instance.get_measure_units()).decodedResult

        assert.isOk(exists)
    })
    it('Should return Users', async () => {
        
        let exists = (await instance.get_users()).decodedResult

        assert.isOk(exists)
    })
    it('Should return Stages', async () => {
        
        let exists = (await instance.get_stages()).decodedResult

        assert.isOk(exists)
    })
    it('Should return Stages', async () => {
        
        let exists = (await instance.get_stages()).decodedResult

         console.log(exists)
    })

    it('Should check if Procedure has been created', async () => {
        procedureId = 'pro1';
        procedureName= 'pro1Name';
        procedureDescription= 'pro1Description for procedure';
        procedureType= 'pro1Type';
        procedureOrganism= 'pro1Organism';
        await instance.add_procedure(procedureId,procedureName,procedureDescription,procedureType,procedureOrganism);

        let exists = (await instance.get_procedure(procedureId)).decodedResult

        assert.isTrue(exists.name==procedureName, 'procedure has not been created')
    })

    it('Should REVERT if procedure already exists', async () => {
        await assert.isRejected(instance.add_procedure('pro1'))
    })

    it('Should return false if name does not exist', async () => {
        procedureName = 'nonexistant';
        let exists = (await instance.get_procedure(procedureName)).decodedResult

        assert.isOk(!exists)
    })

    it('Should return true if the name exists', async () => {
        procedureId = 'pro2';
        procedureName= 'pro2Name';
        procedureDescription= 'pro2Description for procedure';
        procedureType= 'pro2Type';
        procedureOrganism= 'pro2Organism';
        await instance.add_procedure(procedureId,procedureName,procedureDescription,procedureType,procedureOrganism);

        let exists = (await instance.get_procedure(procedureId)).decodedResult

        assert.isOk(exists)
    })

    it('Should check if caller is allowed has been created', async () => {
        const otherUserTraceContract = await unknowUser.getContractInstance(unknowUserContract);
        procedureId = 'proUnknowid';
        procedureName= 'proUnknowName';
        procedureDescription= 'proUnknowDescription for procedure';
        procedureType= 'proUnkType';
        procedureOrganism= 'proUnkOrganism';
        await assert.isRejected(otherUserTraceContract.methods.add_procedure(procedureId,procedureName,procedureDescription,procedureType,procedureOrganism));
    })

   
    it('Add plant variety', async () => {
        
        await instance.add_plant_variety(1,"Variety 1");
         
        let exists = (await instance.get_plant_variety(1)).decodedResult

        assert.isOk(exists,'plant variety has not been created')
    })
    it('Add a lot', async () => {
        
        await instance.add_lot(1,"test lot 1","start_date","end_date",1,1,20);
         
        let exists = (await instance.get_lot(1)).decodedResult

        assert.isTrue(exists.name=="test lot 1", 'lot has not been created')
    })
//preparing for lot stage adding
    it('Add beacon', async () => {
        
        await instance.add_beacon(1,"SZ1234");
         
        let exists = (await instance.get_beacon(1)).decodedResult

        assert.isTrue(exists.identifier=="SZ1234", 'beacon has not been created')
    })
    it('Add beacons 2 to 7', async () => {
        
        await instance.add_beacon(2,"SZ1235");
        await instance.add_beacon(3,"SZ1236");
        await instance.add_beacon(4,"SZ1237");
        await instance.add_beacon(5,"SZ1238");
        await instance.add_beacon(6,"SZ1239");
        await instance.add_beacon(7,"SZ1240"); 
        let exists = (await instance.get_beacon(7)).decodedResult

        assert.isTrue(exists.identifier=="SZ1240", 'beacon has not been created')
    })
    it('Add substratum type', async () => {
        
        await instance.add_substratum_type("1","test substratum","h1n1");
         
        let exists = (await instance.get_substratum_type("1")).decodedResult

        assert.isTrue(exists.name=="test substratum", 'substratum type has not been created')
    })
    it('Add flower pot size', async () => {
        
        await instance.add_flower_pot_size("1",2,"Pote 1 litro",1);
         
        let exists = (await instance.get_flower_pot_size("1")).decodedResult

        assert.isTrue(exists.identifier=="Pote 1 litro", 'flower pot size has not been created')
    })
    it('Add mother plant ', async () => {
        
        await instance.add_mother_plant("1","Planta madre 1");
         
        let exists = (await instance.get_mother_plant("1")).decodedResult

        assert.isTrue(exists.description=="Planta madre 1", 'mother plant has not been created')
    })

    it('Add a lot stage', async () => {
         
        let beacons =  instance.get_beacons()
        let users =  instance.get_users()
        
        
        await instance.add_lot_stage(1,1,beacons,"1",users,"empezando","1","1","1",1,1,"Montevideo","Florida",1,"fecha mañana",1,1,"fecha ayer");
        
        let exists = (await instance.get_lot_stage(1)).decodedResult

        assert.isTrue(exists.origin=="Montevideo", 'lot stage has not been created')
    })
    it('Add 10% humidity measure value to lot stage 1', async () => {
        
    
        
        await instance.add_measure_value("1","10",1,"1");
        let exists = (await instance.get_measure_value("1")).decodedResult

        assert.isTrue(exists.value=="10", 'measure value has not been created')
        
    })
    it('Add 21 degrees measure value to lot stage 1', async () => {
        
    
        
        await instance.add_measure_value("2","21",1,"4");
        let exists = (await instance.get_measure_value("2")).decodedResult

        assert.isTrue(exists.value=="21", 'measure value has not been created')
        
    })
    it('Add 2 liters measure value to lot stage 1', async () => {
        
    
        
        await instance.add_measure_value("3","2",1,"2");
        let exists = (await instance.get_measure_value("3")).decodedResult

        assert.isTrue(exists.value=="2", 'measure value has not been created')
        
    })
    it('Add many humidity measures value to lot stage 1', async () => {
        
    
        
         
        await instance.add_measure_value("4","80",1,"1");
        await instance.add_measure_value("5","60",1,"1");
        await instance.add_measure_value("6","50",1,"1");

        await instance.add_measure_value("7","10",1,"1");
        await instance.add_measure_value("8","11",1,"1");
        await instance.add_measure_value("9","9",1,"1");
        await instance.add_measure_value("10","80",1,"1");
        await instance.add_measure_value("11","60",1,"1");
        await instance.add_measure_value("12","50",1,"1");

        let exists = (await instance.get_measure_value("12")).decodedResult

        assert.isTrue(exists.value=="50", 'measure value has not been created')
        
    })
    it('Add product', async () => {
        
    
        
        await instance.add_product("1","Stride HA","Glucosamine HCL",false);
        let exists = (await instance.get_product("1")).decodedResult

        assert.isTrue(exists.trade_name=="Stride HA", 'product has not been created')
        
    })
    it('Add work order to lot stage 1', async () => {
        
    
        
        await instance.add_work_order(1,"Nueva","Hoy","Mañana","1",1,"1","10%",1);
        let exists = (await instance.get_work_order(1)).decodedResult

        assert.isTrue(exists.concentration=="10%", 'work order has not been created')
        
    })
    it('Add application of work order 1', async () => {
        
    
        
        await instance.add_application("1",2,2,"Hoy",1);
        let exists = (await instance.get_application("1")).decodedResult

        assert.isTrue(exists.quantity==2, 'application has not been created')
        
    })
    it('Add green house location', async () => {
        
    
        
        await instance.add_green_house_location("1","Invernadero base");
        let exists = (await instance.get_green_house_location("1")).decodedResult

        assert.isTrue(exists.identifier=="Invernadero base", 'green house location has not been created')
        
    })
    it('Add green house location history', async () => {
        
    
        
        await instance.add_green_house_location_history(1,1,"1");
        let exists = (await instance.get_green_house_locations_history_by_id(1)).decodedResult

        assert.isTrue(exists.id==1, 'green house location history has not been created')
        
    })


   

})