'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: '67385b45-6c5d-4af5-94e5-26c0ecfa4c5b',
        login: 'John Doe',
        password: 'Ux6S+F4CjrJImNoWka32ESXNXSkSczobE6Ix9jMLGIE+xlBqMLiSWSKotQAqVv3ZSVkaxdRfhmJelMoJyoox0TN98zWzufGNjV37balOiYJkSvL9egETnZ8m4xht9J69jzaLb0b++UDr0AukYFPa3i/0kL8+ZsG0EJkYjBDSBeTFag/GNPZsxjXncIgrYWqUGqyJJkdf4Gux78gIWQ1pRRnyorryt9JN6TUq/0jz7f1ZU7XqXwrAaE70GZ2B3U0fQjdJRd6Ort7Jaw0IRYweuZypG+b5UTm5BzJ+sYyO3GXV+NnB+KwJd+jvsZN4AY5HuPQey3G4wfBQ1p7EQ8ImHA== piVqw4mU+EfojP5km4+QUCxuNEg6UDWRJVdZW8QZgWiAMTqyw1mTDMXwwvebytIYVTCvjzNEwTp7zdiaoUjrtw==',
        age: 35,
        is_deleted: false
      },
      {
        id: '2b8c1a16-a641-4abf-a198-4bd22f5459c2',
        login: 'Mr. Clean',
        password: 'WrIR+aqrlDixWkqgx1x9mfEr6raaQNrwRwQ+5xpiusEqDsy/lkCD491jwtxWORa9k4g1idj4nI/nYd2V+TOYizg7jN1psTzJaMPXLmq4AzXSuwqJ5hOixFHyNx+knvMIznbMtgZOnkOfRU4Nq5wyxlLU3exP2+jQU/9Q43/hfttfAxPdTiRJflf8eVLNbfkCr1VYo6ekr+2JWwWPlO7oLjiMxHhmC6aHBciS/npdGNEHR76MG0q+Wp0orp/7cCI+fjRSCZyIoaJWcralVjY4XQih/sDIoIqk4WDXahUdVA0qKhFkuUHBX8e1WzipqVIJ1EwwyuIxlkJn71T5vubevg== CKWzQEjkXtV6uwv4aC8CAhS7T50tUQG0yVR0wzWLf6LvWMmKxNB9t9TMtNBkXu911KKpxYmIArsMl0ymbGZKdA==',
        age: 42,
        is_deleted: false
      },
      {
        id: 'b406e81a-0cae-459f-abc2-a989dd4a6062',
        login: 'Aladdin',
        password: 'fvjMsvMiYdETgLQ7qG7/qcwzd+5e1sQYtEO4qcGfo4xp9piFn+yItr3sYl4caf7bql/GA/FEiHTIiN4hS/iQuu0XyK8mK3sP09YoQmTD7sMKObbeCNXPqE+hfbAmmFeb2GqdWdCM0/3BprQvuPVRDMVgE+pxhK3vr6FOP2whMf6MSfZkiCtmVLGjISXuT7OJ7AvXtN8zKivl57Ow1V3KIQrrlN6fJnAfjs2d+652zLf2nZEzFWVyrnBwSuzWSwBQWuSO9NQKjZS4GX0MsiAtWdKn8DFkPFHuw5cRliAiXNdPDsaAbmes4LNN7bDM3TAI5uhdd1FAASD+1q1rdhMoHA== 1QsBaV7D1egnmMCLD4BCj9eIDOcDIsTTIgNEx6FmtcdOIAqbOebDOyxjTuG1dbpVpgVBeNMrgeXWVy3nxevj6w==',
        age: 20,
        is_deleted: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
