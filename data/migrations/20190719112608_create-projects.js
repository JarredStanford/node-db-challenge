
exports.up = function (knex) {
    return knex.schema
        .createTable('projects', tbl => {
            tbl.increments();
            tbl.text('name', 128)
                .unique()
                .notNullable()
            tbl.text('description')
                .notNullable()
            tbl.boolean('completed')
                .defaultTo('false')
        })

        .createTable('actions', tbl => {
            tbl.increments()
            tbl.integer('project_id')
                .notNullable()
                .references('id')
                .inTable('projects')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
            tbl.text('description')
                .notNullable()
            tbl.text('notes')
                .notNullable()
            tbl.boolean('completed')
                .defaultTo('false')
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('projects')
        .dropTableIfExists('actions')
};
