<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230619175239 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pitch ADD state_id INT NOT NULL');
        $this->addSql('ALTER TABLE pitch ADD CONSTRAINT FK_279FBED95D83CC1 FOREIGN KEY (state_id) REFERENCES state (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_279FBED95D83CC1 ON pitch (state_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE pitch DROP CONSTRAINT FK_279FBED95D83CC1');
        $this->addSql('DROP INDEX IDX_279FBED95D83CC1');
        $this->addSql('ALTER TABLE pitch DROP state_id');
    }
}
