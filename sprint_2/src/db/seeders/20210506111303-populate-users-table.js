'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: '67385b45-6c5d-4af5-94e5-26c0ecfa4c5b',
        login: 'John Doe',
        // password: 'JohnDoe1'
        password: 'JxfatobXRFDFVVj8fvPnlcfQIiSKzrJHQrlZW2wd0643d/Tv9UQBQ76rHG+SGGagPftffvZS8QxyS2kfVHg5zBzDy4riG6YxaYSz3i4VaJO3nlCwITjcgl+dIiaQ3H8WD30zU4PfQKNvvgyW1nyH8RGicSBF2dHWHlwnh9poKh2eGm9lO56AMlfcICNLtiQuG9GVRcHe6wCAeLvKnNlEuxH72nSqkGq3TY799LVNReGU29O2hQ22At9xccAPDwYdxB07JRpzlbPaUlWGRCvUAdgZCgz0lz7GACHLwy+2B9B7fua3HTXdWwkh2QKgt6jJ/TYT8STAN7TdMZFwsdZCcw== u0BwKdgq7tqJ7UW1zXW1rC93WsBlaFHC5fj0wnrYM54AHrMEDmI1yJl7m9WhctyZoaJTOgyUx4NW/MAV9ZHkRg==',
        age: 35,
        is_deleted: false
      },
      {
        id: '2b8c1a16-a641-4abf-a198-4bd22f5459c2',
        login: 'Mr. Clean',
        // password: 'Mr.Clean1'
        password: 'xQDgcnWqBDMGSBaDUOIrH+3pqv+en1f+vd1WH0Y49QF+tMNHbq9mPjdJiZjhWHCdQKpc/YDFmhoVEw126OwW1JEsw8K+4RxwXU4DljQETs9LaGlQJObL01RbCKc97u353571FHxpYoDSl17qUyl/vCUmI8p1tt2R66/ZnBDnbg86rXql+mwxNb1kJow0QZm57Qkq7n9Wbhahmd+0P1bonlKneIIZqqx8HHkwgvWAM8m/q3Tl3zsp9s574awBS+toETQVhha7Li68MxFgyT6eCjbLrBTGNTQYa0pIEOrBwGNzT1paWd+MpOeWv7lPbCwcTt5Riyc8E2yiiXZtsxle/Q== g5CXgWh0gFsaH8nJgbqky0Q6cxw+jtwnmy3wBKR6ZGjKiKUJ8zye8Sn+bx2pVXLiGMgMhJCFnDkFE928Envcpw==',
        age: 42,
        is_deleted: false
      },
      {
        id: 'b406e81a-0cae-459f-abc2-a989dd4a6062',
        login: 'Aladdin',
        // password: 'Aladdin1'
        password: 'ryXlyywjh0ZXAx4/VgD1MQg4VkkTJgD4jAjTphr6b0N4Xg4K9jhwg+IUx+TwQxj9xBZarqQ+dkZr1G/nicSioEryr8/9l9imCsdBYIFae0F/VieYxKX8J8Z90zCfrrYqFm8qC+/LElIvKH0DfkUEHDzOcRRiMxFGQfd8dxYFd7OBnpyZjdosv251G4E2XqSDpuSX64UZi53qlE/gDr0wxHN9rWbHKLVZcm+1yrNSaK3BhRuHXNiktdFbkiDGC6B608dgiGrUtXNWKaLVDOTxDSFeUaazGDx53izZHs51uF0n8cvKq1pJvBNOwaMEJ7abjqrGg13PfbnO5u7edWwXEg== cKLGw5Qrsb/XYC/mmQQSoJ9peD3QAcLhBYa2anrz9IdUPto6SvNIZefn2PRr/zztpJxgP+y6wkdyigkG8xa+Ig==',
        age: 20,
        is_deleted: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
