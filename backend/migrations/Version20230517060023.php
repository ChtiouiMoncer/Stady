<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230517060023 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE opening_time_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE time_slot_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE opening_time (id INT NOT NULL, pitch_id INT DEFAULT NULL, open_time TIME(0) WITHOUT TIME ZONE DEFAULT NULL, close_time TIME(0) WITHOUT TIME ZONE DEFAULT NULL, is_closed BOOLEAN DEFAULT NULL, interval INT DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_89115E6EFEEFC64B ON opening_time (pitch_id)');
        $this->addSql('CREATE TABLE time_slot (id INT NOT NULL, opening_time_id INT DEFAULT NULL, start_time TIME(0) WITHOUT TIME ZONE DEFAULT NULL, end_time TIME(0) WITHOUT TIME ZONE DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, is_available BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_1B3294A6A8073BB ON time_slot (opening_time_id)');
        $this->addSql('ALTER TABLE opening_time ADD CONSTRAINT FK_89115E6EFEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE time_slot ADD CONSTRAINT FK_1B3294A6A8073BB FOREIGN KEY (opening_time_id) REFERENCES opening_time (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE opening_time_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE time_slot_id_seq CASCADE');
        $this->addSql('ALTER TABLE opening_time DROP CONSTRAINT FK_89115E6EFEEFC64B');
        $this->addSql('ALTER TABLE time_slot DROP CONSTRAINT FK_1B3294A6A8073BB');
        $this->addSql('DROP TABLE opening_time');
        $this->addSql('DROP TABLE time_slot');
    }
}
