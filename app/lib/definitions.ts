export type Contest = {
  id: string;
  name: string;
  choices: Choice[];
};

export type Choice = {
  id: string;
  value: string;
};
