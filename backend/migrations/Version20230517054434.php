<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230517054434 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE address_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE amenties_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE image_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE review_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE address (id INT NOT NULL, pitch_id INT NOT NULL, longitude VARCHAR(255) NOT NULL, latitude VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D4E6F81FEEFC64B ON address (pitch_id)');
        $this->addSql('CREATE TABLE amenties (id INT NOT NULL, pitch_id INT NOT NULL, has_shower BOOLEAN NOT NULL, has_secure_storage BOOLEAN NOT NULL, has_changing_room BOOLEAN NOT NULL, has_restaurent BOOLEAN NOT NULL, has_parking BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9FE47DACFEEFC64B ON amenties (pitch_id)');
        $this->addSql('CREATE TABLE image (id INT NOT NULL, image_path VARCHAR(255) NOT NULL, width INT NOT NULL, height INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, owner_id INT NOT NULL, total_price DOUBLE PRECISION DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_42C849557E3C61F9 ON reservation (owner_id)');
        $this->addSql('CREATE TABLE review (id INT NOT NULL, owner_id INT DEFAULT NULL, review_text VARCHAR(255) DEFAULT NULL, review_star INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_794381C67E3C61F9 ON review (owner_id)');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F81FEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE amenties ADD CONSTRAINT FK_9FE47DACFEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849557E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C67E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE address_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE amenties_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE image_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE review_id_seq CASCADE');
        $this->addSql('ALTER TABLE address DROP CONSTRAINT FK_D4E6F81FEEFC64B');
        $this->addSql('ALTER TABLE amenties DROP CONSTRAINT FK_9FE47DACFEEFC64B');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C849557E3C61F9');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C67E3C61F9');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE amenties');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE review');
    }
}
