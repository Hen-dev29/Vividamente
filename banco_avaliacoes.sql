CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    p1 INT NOT NULL,
    p2 INT NOT NULL,
    p3 INT NOT NULL,
    p4 INT NOT NULL,
    p5 INT NOT NULL,
    p6 INT NOT NULL,
    p7 INT NOT NULL,
    p8 INT NOT NULL,
    p9 INT NOT NULL,
    p10 INT NOT NULL,
    p11 INT NOT NULL,
    p12 INT NOT NULL,
    p13 INT NOT NULL,
    p14 INT NOT NULL,
    p15 INT NOT NULL,
    p16 INT NOT NULL,
    p17 INT NOT NULL,
    p18 INT NOT NULL,
    p19 INT NOT NULL,
    p20 INT NOT NULL,
    p21 INT NOT NULL,
    data_resposta DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Execute esta linha uma vez apenas se a tabela antiga ainda possuir identificacao:
-- ALTER TABLE avaliacoes DROP COLUMN identificacao;
