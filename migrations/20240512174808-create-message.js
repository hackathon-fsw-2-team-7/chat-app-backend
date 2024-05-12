'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        await queryInterface.createTable('Message', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            body: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdBy: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'username',
                },
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Message');
    }
};