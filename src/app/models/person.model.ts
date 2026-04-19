export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
}

export type CreatePersonDTO = Omit<Person, 'id'>;
export type UpdatePersonDTO = Omit<Person, 'id'>;

