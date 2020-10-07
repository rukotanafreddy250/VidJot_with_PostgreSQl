const { check } = require("express-validator");

function formValidation(){
    [ 
       check('text',)
            .isEmpty().custom( (value, { req }) =>{
                req.flash('erro_msg', 'Empty Fields');
            })
    ]
}

module.exports = formValidation;