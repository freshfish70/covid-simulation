# Getting started

- npm install / yarn
- npm run develop / yarn develop
- npm run buildwp / yarn buildwp

# About the project

This simulator was created as a final assignment in the course IR201812 - Statistics and simulation @ NTNU Ålesund. The main task was to reproduce the four scenarios modeled in [washington Post - corona simulator ](https://www.washingtonpost.com/graphics/2020/world/corona-simulator/). The assignment also had additional parameters and scenarios which had to be implemented and analyzed,

**Some rules for the assignment:**

- Agent based simulation.

- Free mobility scenario has to have an infection probability of 2.5

- 200 persons for first experiments.

- Must include scenarios:

- - Free for all - Every person can move freely.
  - Forced Quarantine - A portion of persons are locked up for a period where one is infected, before a the lock is opened gradually.
  - One quarter - One quarter of the population is allowed to move freely, the rest is in quarantine.
  - One in eighth - Only every eighth person is allowed to move freely, the rest is in quarantine.

- Probability of people dying.

- - When age is disabled the mortality for every person is: 3%

- The effects of age (mortality as a function of age).

- - Age: 80+, Mortality: 14.8%
  - Age: 70+, Mortality: 8%
  - Age: 60+, Mortality: 3.6%
  - Age: 50+, Mortality: 1.3%
  - Age: 40+, Mortality: 0.4%
  - Age: 30+, Mortality: 0.2%
  - Age: 20+, Mortality: 0.2%
  - Age: 10+, Mortality: 0.2%
  - Age: 0+, Mortality: 0%

- Age distribution when age is enabled

- - Age: 80-90, Probability: 8%
  - Age: 60-79, Probability: 20%
  - Age: 40-59, Probability: 25%
  - Age: 20-39, Probability: 30%
  - Age: 0-19, Probability: 17%

- Scale simulations to 100.000 persons and the area proportionally and analyze the difference of infected, recovered and dead people. (Requires a good computer, so excluded from online version)

The simulator was written from scratch using JavaScript (Typescript), P5js for drawing, and Chart.js for charts. Code is available on GitHub
