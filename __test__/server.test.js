// 'use strict';
// const supertest = require('supertest');
// const {app} = require('../scr/server');
// const request = supertest(app);


// describe('API SERVER TEST', ()=> {

//     // add scenarios & test cases 
//     it('handles 404 on a bad route', async () => {
       
//         const response = await request.get('/wrongPath'); // async
//         expect(response.status).toEqual(200);
//     });


//     it('ERROR 404', async () => {
    
//         const response = await request.post('/'); // async
//         expect(response.status).toEqual(404);
//     });



//     it('success  /', async () => {
//         const response = await request.get('/'); // async
//         expect(response.status).toEqual(200);
//     });
// })

// // ==========================================


// describe('DATA BASE TEST', ()=> {
//     let obj={
//         username:'sultan',
//         password:'test@1234'
//     }

//     it('creat account  ', async () => {
       
//         const response = await request.post('/signup').send(obj); // async
//         expect(response.status).toEqual(201);
      
    
//     });

//     it('sign in   ', async () => {
     
       
//         const response = await request.post('/signin').send({
//             username:'ss',
//             password:'ss'
//         }).auth(reqObj.body.username,'ss');
        
//         expect(response.status).toEqual(200);
   
      
    
//     });


    
// })


