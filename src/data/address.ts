import { fakerES as faker } from '@faker-js/faker';

export interface Address {
  /** Visible label in the country dropdown. */
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
}

export function buildAddress(overrides: Partial<Address> = {}): Address {
  return {
    country: 'Spain',
    postalCode: faker.location.zipCode('#####'),
    houseNumber: faker.location.buildingNumber(),
    street: faker.location.street(),
    city: faker.location.city(),
    state: faker.location.state(),
    ...overrides,
  };
}
