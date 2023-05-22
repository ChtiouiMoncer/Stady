<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230522043654 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE opening_time ADD day VARCHAR(10) NOT NULL');
        $this->addSql('ALTER TABLE pitch ADD floor_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE pitch ALTER is_pending DROP NOT NULL');
        $this->addSql('ALTER TABLE pitch ADD CONSTRAINT FK_279FBED96589065F FOREIGN KEY (floor_type_id) REFERENCES floor_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_279FBED96589065F ON pitch (floor_type_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE pitch DROP CONSTRAINT FK_279FBED96589065F');
        $this->addSql('DROP INDEX IDX_279FBED96589065F');
        $this->addSql('ALTER TABLE pitch DROP floor_type_id');
        $this->addSql('ALTER TABLE pitch ALTER is_pending SET NOT NULL');
        $this->addSql('ALTER TABLE opening_time DROP day');
    }
}
