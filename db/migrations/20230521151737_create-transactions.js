"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary();
        table.text("title").notNullable();
        table.decimal("amount", 10, 2).notNullable();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable("transactions");
}
exports.down = down;
