import { createMultipleExecutor } from './Executor';

describe(`Executor`, () => {
  it(`should work`, () => {
    let sum = 0;
    const e = createMultipleExecutor();

    e.add({ EVENT: (data: number) => (sum += data) });
    e.exec('EVENT', 10);
    e.exec('EVENT', 20);

    expect(sum).toBe(30);
  });
});
