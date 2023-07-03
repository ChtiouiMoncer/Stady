<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230703023753 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE feedback_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE feedback (id INT NOT NULL, owner_id INT DEFAULT NULL, feedback_text VARCHAR(255) NOT NULL, feedback_star INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D22944587E3C61F9 ON feedback (owner_id)');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D22944587E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE feedback_id_seq CASCADE');
        $this->addSql('ALTER TABLE feedback DROP CONSTRAINT FK_D22944587E3C61F9');
        $this->addSql('DROP TABLE feedback');
    }
}
