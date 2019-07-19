const db = require('../data/db-config.js')

module.exports = {
    find,
    findById,
    postProject,
    postAction
}

function find() {
    return db('projects')
}

function findById(id) {
    return db('projects')
        .where({ id })
        .first()
        .then(project => {
            return db('actions')
                .where({ project_id: id })
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