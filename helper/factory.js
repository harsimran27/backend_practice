function createElement(elementModel){
    return async function (req, res) {
        try {
            let element = await elementModel.create(req.body);
            res.status(200).json({
                element: element,
            })
        } catch (err) {
            res.status(404).json({
                message: err.message,
            })
        }
    }
}

function getElements(elementModel){
    return async function (req, res) {
        try {
            let element = await elementModel.find();
            res.status(200).json({
                element: element,
            })
    
        } catch (err) {
            res.status(404).json({
                message: err.message,
            })
        }
    }
}

function getElement(elementModel){
    return async function(req, res) {
        try {
            let { id } = req.params;
            let element = await elementModel.findById(id);
            res.status(200).json({
                element: element,
            })

        } catch (err) {
            res.status(404).json({
                message: err.message,
            })
        }
    }
}

function updateElement(elementModel){
    return async function(req, res) {
    
        try {
            let { id } = req.params;
    
            if (req.body.password || req.body.confirmPassword) {
                res.json({
                    message: "use forget password instead",
                })
            }
    
            let element = await elementModel.findById(id);
    
            for (let key in req.body) {
                element[key] = req.body[key];
            }
    
            await element.save({
                validateBeforeSave: false,
            });
    
            res.status(200).json({
                element: element,
            })
    
        } catch (err) {
            res.status(404).json({
                message: err.message,
            })
        }
    }
}

function deleteElement(elementModel){
    return async function(req, res) {
        try {
            let { id } = req.params;
            let element = await elementModel.findByIdAndDelete(id);
            res.status(200).json({
                element: element,
            })
    
        } catch (err) {
            res.status(404).json({
                message: err.message,
            })
        }
    }
}