function createElement(elementModel) {
    return async function (req, res) {
        try {
            let element = await elementModel.create(req.body);
            res.status(200).json({
                element: element
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}

function getElements(elementModel) {
    return async function (req, res) {
        try {
            let requestPromise;

            if (req.query.myQuery) {
                requestPromise = elementModel.find(req.query.myQuery);
            } else {
                requestPromise = elementModel.find();
            }

            if (req.query.sort) {
                requestPromise = requestPromise.sort(req.query.sort);
            }

            if (req.query.select) {
                let params = req.query.select.split("%").join(" ");
                requestPromise = requestPromise.select(params);
            }

            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let toSkip = (page - 1) * limit;
            requestPromise = requestPromise
                .skip(toSkip)
                .limit(limit);

            let elements = await requestPromise;
            res.status(200)
                .json({
                    element: elements,
                })

        } catch (err) {
            console.log(err);
            res.status(404).json({
                message: err.message,
            })
        }
    }
}

function getElement(elementModel) {
    return async function (req, res) {
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

function updateElement(elementModel) {
    return async function (req, res) {

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

function deleteElement(elementModel) {
    return async function (req, res) {
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

module.exports.createElement = createElement;
module.exports.deleteElement = deleteElement;
module.exports.updateElement = updateElement;
module.exports.getElements = getElements;
module.exports.getElement = getElement;
