<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230517055007 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE floor_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE sports_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE floor_type (id INT NOT NULL, sports_type_id INT DEFAULT NULL, floor_name VARCHAR(20) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A0229C0FE363E3E3 ON floor_type (sports_type_id)');
        $this->addSql('CREATE TABLE sports_type (id INT NOT NULL, sports_name VARCHAR(20) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE floor_type ADD CONSTRAINT FK_A0229C0FE363E3E3 FOREIGN KEY (sports_type_id) REFERENCES sports_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE pitch ADD sports_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE pitch ADD CONSTRAINT FK_279FBED9E363E3E3 FOREIGN KEY (sports_type_id) REFERENCES sports_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_279FBED9E363E3E3 ON pitch (sports_type_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE pitch DROP CONSTRAINT FK_279FBED9E363E3E3');
        $this->addSql('DROP SEQUENCE floor_type_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE sports_type_id_seq CASCADE');
        $this->addSql('ALTER TABLE floor_type DROP CONSTRAINT FK_A0229C0FE363E3E3');
        $this->addSql('DROP TABLE floor_type');
        $this->addSql('DROP TABLE sports_type');
        $this->addSql('DROP INDEX IDX_279FBED9E363E3E3');
        $this->addSql('ALTER TABLE pitch DROP sports_type_id');
    }
}
