import { fakerES as faker } from '@faker-js/faker';
import type { NewUser } from '@api/types';

export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName().slice(0, 20);
  return {
    first_name: firstName,
    last_name: lastName,
    // Unique per run; example.com is reserved for documentation, so no real inbox is hit.
    email: faker.internet
      .email({ firstName, lastName, provider: 'example.com', allowSpecialCharacters: false })
      .replace('@', `.${faker.string.alphanumeric(8).toLowerCase()}@`),
    // The API requires upper and lower case letters, digits and symbols.
    password: `${faker.internet.password({ length: 12, memorable: false })}Aa1!`,
    dob: faker.date.birthdate({ mode: 'age', min: 25, max: 60 }).toISOString().slice(0, 10),
    phone: faker.string.numeric(9),
    address: {
      street: faker.location.street(),
      house_number: faker.location.buildingNumber(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'ES',
      postal_code: faker.location.zipCode('#####'),
    },
    ...overrides,
  };
}
