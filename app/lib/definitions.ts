export type Contest = {
  id: string;
  name: string;
  choices: Choice[];
};

export type Choice = {
  id: string;
  name: string;
};
