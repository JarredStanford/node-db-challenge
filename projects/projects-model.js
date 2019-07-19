const db = require('../data/db-config.js')

module.exports = {
    find,
    findProjectByName,
    findById,
    postProject,
    postAction
}

function find() {
    return db('projects')
}

function findProjectByName(name) {
    return db('projects')
        .where({ name })
}

function findById(id) {
    return db('projects as p')
        .where({ id })
        .first()
        .select('p.id', 'p.name', 'p.description', 'p.completed')
        .then(project => {
            return db('actions as a')
                .where({ project_id: id })
                .select('a.id', 'a.description', 'a.notes', 'a.completed')
                .then(actions => {
                    return { ...project, actions }
                })
        })
}

async function postProject(project) {
    const [id] = await db('projects').insert(project)
    return findById(id)
}

async function postAction(action) {
    const [id] = await db('actions').insert(action)
    return findById(action.project_id)
}