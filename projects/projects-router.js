const express = require('express')

const Projects = require('./projects-model.js')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const projects = await Projects.find()
        projects.map(project => {
            project.completed = project.completed === 1 ? true : false
        })
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({
            message: "There was an error retrieving the projects."
        })
    }
})

router.get('/:id/actions', async (req, res) => {

    const { id } = req.params

    try {
        const project = await Projects.findById(id)
        if (project.name) {
            if (project.actions.length > 0) {
                console.log(project.completed)
                project.completed = project.completed === 1 ? true : false
                project.actions.map(action => {
                    action.completed = action.completed === 1 ? true : false
                })
                res.status(200).json(project)
            } else {
                res.status(404).json({
                    messsage: "This project has no associated actions."
                })
            }
        } else {
            res.status(404).json({
                message: "The project with this ID could not be found."
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error retrieving the project."
        })
    }
})

router.post('/', validateNewProjectBody, validateUniqueName, async (req, res) => {
    const newProject = req.body
    try {
        const project = await Projects.postProject(newProject)
        res.status(200).json(project)
    } catch (err) {
        res.status(500).json({
            message: "There was an error creating the project."
        })
    }
})

router.post('/:id/actions', validateNewActionBody, async (req, res) => {
    const newAction = {
        description: req.body.description,
        notes: req.body.notes,
        completed: req.body.completed,
        project_id: req.params.id
    }

    try {
        const action = await Projects.postAction(newAction)
        res.status(200).json(action)
    } catch (err) {
        res.status(500).json({
            message: "There was an error creating the action."
        })
    }
})

//middleware
async function validateUniqueName(req, res, next) {
    project = await Projects.findProjectByName(req.body.name)
    if (project.length > 0) {
        res.status(404).json({
            message: "A project with this name already exists."
        })
    } else {
        next()
    }
}

function validateNewProjectBody(req, res, next) {
    req.body.name && req.body.description
        ? next()
        : res.status(404).json({
            message: "Please include a name and body with your new project."
        })
}

function validateNewActionBody(req, res, next) {
    req.body.description && req.body.notes
        ? next()
        : res.status(404).json({
            message: "Please include a description and notes with your new action."
        })
}

module.exports = router