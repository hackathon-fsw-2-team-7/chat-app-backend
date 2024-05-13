'use strict';

const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert("User", [
            {
                id: uuidv4(),
                username: "user1",
                password: bcrypt.hashSync("user1", 10),
                name: "user 1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: uuidv4(),
                username: "user2",
                password: bcrypt.hashSync("user2", 10),
                name: "user 2",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("User", {
            username: ["user1", "user2"]
        })
    }
};
