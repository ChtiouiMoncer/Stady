<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230610174947 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation_pitch DROP CONSTRAINT fk_64e06e7eb83297e7');
        $this->addSql('ALTER TABLE reservation_pitch DROP CONSTRAINT fk_64e06e7efeefc64b');
        $this->addSql('DROP TABLE reservation_pitch');
        $this->addSql('ALTER TABLE reservation ADD pitch_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955FEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_42C84955FEEFC64B ON reservation (pitch_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE reservation_pitch (reservation_id INT NOT NULL, pitch_id INT NOT NULL, PRIMARY KEY(reservation_id, pitch_id))');
        $this->addSql('CREATE INDEX idx_64e06e7efeefc64b ON reservation_pitch (pitch_id)');
        $this->addSql('CREATE INDEX idx_64e06e7eb83297e7 ON reservation_pitch (reservation_id)');
        $this->addSql('ALTER TABLE reservation_pitch ADD CONSTRAINT fk_64e06e7eb83297e7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation_pitch ADD CONSTRAINT fk_64e06e7efeefc64b FOREIGN KEY (pitch_id) REFERENCES pitch (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955FEEFC64B');
        $this->addSql('DROP INDEX IDX_42C84955FEEFC64B');
        $this->addSql('ALTER TABLE reservation DROP pitch_id');
    }
}
