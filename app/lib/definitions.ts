export type Contest = {
  id: number;
  name: string;
  choices: Choice[];
};

export type Choice = {
  id: number;
  value: string;
};
