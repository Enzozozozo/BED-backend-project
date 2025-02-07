const pool = require("../services/db");

const initTables = () => {
  return new Promise((resolve, reject) => {
    const SQLSTATEMENT = `
    DROP TABLE IF EXISTS Reviews;
    DROP TABLE IF EXISTS Inventory;
    DROP TABLE IF EXISTS Monkey;
    DROP TABLE IF EXISTS UserCompletion;
    DROP TABLE IF EXISTS FitnessChallenge;
    DROP TABLE IF EXISTS User;

    
    CREATE TABLE User (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      skillpoints INT DEFAULT 0
    );

    CREATE TABLE FitnessChallenge (
      challenge_id INT AUTO_INCREMENT PRIMARY KEY,
      creator_id INT NOT NULL,
      challenge TEXT NOT NULL,
      skillpoints INT NOT NULL
    );

    CREATE TABLE UserCompletion (
      complete_id INT AUTO_INCREMENT PRIMARY KEY,
      challenge_id INT NOT NULL,
      user_id INT NOT NULL,
      completed BOOL NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      skillpoints INT NOT NULL,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES User(user_id),
      CONSTRAINT fk_challenge FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id)
    );

    CREATE TABLE Monkey (
      monkey_id INT AUTO_INCREMENT PRIMARY KEY,
      monkeyName VARCHAR(255) NOT NULL,
      monkeyType VARCHAR(255) NOT NULL,
      monkeyPrice INT NOT NULL,
      monkeyUpgrade ENUM('000', '100', '010', '001', '200', '020', '002', '222') DEFAULT '000',
      upgradeTier1Price INT NOT NULL,
      upgradeTier2Price INT NOT NULL
    );


    CREATE TABLE Inventory (
      inventory_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      monkey_id INT NOT NULL,
      monkeyType VARCHAR(255),
      monkeyPrice INT,
      monkeyUpgrade ENUM('000', '100', '010', '001', '200', '020', '002', '222') DEFAULT '000',
      CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES User(user_id),
      CONSTRAINT fk_inventory_monkey FOREIGN KEY (monkey_id) REFERENCES Monkey(monkey_id)
    );

    CREATE TABLE Reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      review_amt INT NOT NULL,
      review_text VARCHAR(255),
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO Reviews (review_amt, review_text, user_id) VALUES
      (5, 'cool challenge', 5),
      (2, 'iimsosleepy', 53),  
      (3, 'Wow! ! !', 19);

    INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
    (1, 'Complete 2.4km within 15 minutes', 50),
    (1, 'Cycle around the island for at least 50km', 100),
    (2, 'Complete a full marathon (42.2km)', 200),
    (2, 'Hold a plank for 5 minutes', 50),
    (2, 'Perform 100 push-ups in one session', 75);

    INSERT INTO Monkey (monkeyName, monkeyType, monkeyPrice, monkeyUpgrade, upgradeTier1Price, upgradeTier2Price) VALUES
    ('Dart Monkey', 'primary', 500, '000', 250, 750),
    ('Wizard Monkey', 'magic', 750, '000', 250, 750),
    ('Engineer Monkey', 'support', 500, '000', 550, 1050), 
    ('Heli Pilot Monkey', 'military', 750, '000', 650, 750),
    ('Boomerang Monkey', 'primary', 500, '000', 200, 350),
    ('Dart Monkey', 'primary', 500, '200', 250, 750),
    ('Dart Monkey', 'primary', 500, '020', 250, 750),
    ('Dart Monkey', 'primary', 500, '002', 250, 750),
    ('Dart Paragon', 'primary', 500, '222', 250, 750),
    ('Wizard Paragon', 'magic', 750, '222', 250, 750);
    `;


    pool.query(SQLSTATEMENT, (error, results) => {
      if (error) {
        console.error("Error creating tables:", error);
        reject(error);
      } else {
        console.log("Tables created successfully");
        resolve();
      }
    });
  });
};

module.exports = initTables;
