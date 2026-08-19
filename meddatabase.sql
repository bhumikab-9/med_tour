CREATE DATABASE  IF NOT EXISTS `meddatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meddatabase`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: meddatabase
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `id` bigint DEFAULT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `specialization` varchar(70) DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,1,'Dr. Aman Sharma','9876502001','aman.sharma@bathindageneral.com','Cardiologist',14),(2,1,'Dr. Simran Kaur','9876502002','simran.kaur@bathindageneral.com','Orthopedic Surgeon',9),(3,1,'Dr. Rohit Gupta','9876502003','rohit.gupta@bathindageneral.com','Pediatrician',11),(4,2,'Dr. Arjun Mehta','9876502004','arjun.mehta@fortisludhiana.com','Cardiologist',18),(5,2,'Dr. Neha Kapoor','9876502005','neha.kapoor@fortisludhiana.com','Neurologist',12),(6,2,'Dr. Vikram Singh','9876502006','vikram.singh@fortisludhiana.com','General Surgeon',15),(7,3,'Dr. Priya Malhotra','9876502007','priya.malhotra@cmc.com','Neurologist',10),(8,3,'Dr. Karan Bansal','9876502008','karan.bansal@cmc.com','Dermatologist',8),(9,3,'Dr. Riya Sethi','9876502009','riya.sethi@cmc.com','Ophthalmologist',13),(10,4,'Dr. Harpreet Singh','9876502010','harpreet.singh@amritsarhospital.com','Pediatrician',17),(11,4,'Dr. Jasleen Kaur','9876502011','jasleen.kaur@amritsarhospital.com','ENT Specialist',7),(12,4,'Dr. Anjali Verma','9876502012','anjali.verma@amritsarhospital.com','Gynecologist',16),(13,5,'Dr. Rajiv Malhotra','9876502013','rajiv.malhotra@dami.com','Cardiac Surgeon',22),(14,5,'Dr. Sneha Agarwal','9876502014','sneha.agarwal@dami.com','Oncologist',19),(15,5,'Dr. Manish Arora','9876502015','manish.arora@dami.com','General Surgeon',20),(16,6,'Dr. Deepak Jain','9876502016','deepak.jain@jaipurhospital.com','Orthopedic Surgeon',14),(17,6,'Dr. Kavya Sharma','9876502017','kavya.sharma@jaipurhospital.com','Dermatologist',9),(18,6,'Dr. Pooja Mehta','9876502018','pooja.mehta@jaipurhospital.com','Gynecologist',12),(19,7,'Dr. Aditya Khanna','9876502019','aditya.khanna@mohalihealth.com','Neurologist',11),(20,7,'Dr. Meera Gill','9876502020','meera.gill@mohalihealth.com','Ophthalmologist',15),(21,7,'Dr. Rahul Sood','9876502021','rahul.sood@mohalihealth.com','ENT Specialist',10),(22,8,'Dr. Gaurav Sharma','9876502022','gaurav.sharma@patialacityhospital.com','Orthopedic Surgeon',13),(23,8,'Dr. Nisha Verma','9876502023','nisha.verma@patialacityhospital.com','Pediatrician',8),(24,8,'Dr. Sandeep Kumar','9876502024','sandeep.kumar@patialacityhospital.com','General Surgeon',16);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility`
--

DROP TABLE IF EXISTS `facility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility` (
  `id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility`
--

LOCK TABLES `facility` WRITE;
/*!40000 ALTER TABLE `facility` DISABLE KEYS */;
INSERT INTO `facility` VALUES (1,'Emergency Department','24 hour emergency and trauma care'),(2,'ICU','Intensive care unit for critically ill patients'),(3,'Pharmacy','In-house pharmacy for prescribed medicines'),(4,'Ambulance Service','Emergency patient transportation service'),(5,'Blood Bank','Blood collection, storage and transfusion facility'),(6,'Parking','Patient and visitor parking facility'),(7,'Cafeteria','Food and beverage service for patients and visitors'),(8,'Diagnostic Laboratory','Laboratory for blood and diagnostic testing'),(9,'MRI Centre','Advanced magnetic resonance imaging facility'),(10,'Physiotherapy Centre','Physical rehabilitation and therapy services');
/*!40000 ALTER TABLE `facility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital`
--

DROP TABLE IF EXISTS `hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital` (
  `id` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `established_year` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `hospital_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital`
--

LOCK TABLES `hospital` WRITE;
/*!40000 ALTER TABLE `hospital` DISABLE KEYS */;
INSERT INTO `hospital` VALUES (1,'Bathinda General Hospital',1,'Civil Lines, Bathinda','151001','9876501001','info@bathindageneral.com',1998),(2,'Fortis Ludhiana',2,'Chandigarh Road, Ludhiana','141010','9876501002','contact@fortisludhiana.com',2005),(3,'Chandigarh Medical Centre',3,'Sector 34, Chandigarh','160022','9876501003','info@cmc.com',2010),(4,'Amritsar Care Hospital',4,'Mall Road, Amritsar','143001','9876501004','care@amritsarhospital.com',2001),(5,'Delhi Advanced Medical Institute',5,'Rohini, Delhi','110085','9876501005','contact@dami.com',1995),(6,'Jaipur Multispeciality Hospital',6,'Malviya Nagar, Jaipur','302017','9876501006','info@jaipurhospital.com',2012),(7,'Mohali Health Institute',7,'Phase 7, Mohali','160062','9876501007','hello@mohalihealth.com',2008),(8,'Patiala City Hospital',8,'Model Town, Patiala','147001','9876501008','info@patialacityhospital.com',2003);
/*!40000 ALTER TABLE `hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitalfacility`
--

DROP TABLE IF EXISTS `hospitalfacility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitalfacility` (
  `id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `facility_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `facility_id` (`facility_id`),
  CONSTRAINT `hospitalfacility_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospitalfacility_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitalfacility`
--

LOCK TABLES `hospitalfacility` WRITE;
/*!40000 ALTER TABLE `hospitalfacility` DISABLE KEYS */;
INSERT INTO `hospitalfacility` VALUES (1,1,1,1,'24 hour emergency department'),(2,1,2,1,'10 bed ICU'),(3,1,3,1,'24 hour pharmacy'),(4,1,4,4,'Four ambulances'),(5,1,8,1,'Full diagnostic laboratory'),(6,2,1,1,'Advanced emergency department'),(7,2,2,2,'20 bed combined ICU'),(8,2,3,1,'24 hour pharmacy'),(9,2,5,1,'Licensed blood bank'),(10,2,9,1,'Advanced MRI centre'),(11,3,1,1,'Emergency services'),(12,3,3,1,'In-house pharmacy'),(13,3,8,1,'Diagnostic laboratory'),(14,3,9,1,'MRI imaging facility'),(15,3,6,1,'Multi-level visitor parking'),(16,4,1,1,'24 hour emergency care'),(17,4,2,1,'12 bed ICU'),(18,4,3,1,'Hospital pharmacy'),(19,4,4,3,'Three ambulances'),(20,4,7,1,'Patient and visitor cafeteria'),(21,5,1,1,'Advanced trauma and emergency unit'),(22,5,2,3,'Multiple specialized ICU units'),(23,5,5,1,'Full service blood bank'),(24,5,8,1,'Advanced pathology laboratory'),(25,5,9,2,'Two MRI units'),(26,5,10,1,'Rehabilitation and physiotherapy centre'),(27,6,1,1,'Emergency department'),(28,6,3,1,'24 hour pharmacy'),(29,6,6,1,'Large visitor parking'),(30,6,8,1,'Diagnostic laboratory'),(31,6,10,1,'Sports injury rehabilitation'),(32,7,1,1,'Emergency services'),(33,7,2,1,'15 bed ICU'),(34,7,3,1,'In-house pharmacy'),(35,7,9,1,'Advanced MRI centre'),(36,8,1,1,'Emergency and trauma unit'),(37,8,3,1,'Hospital pharmacy'),(38,8,4,2,'Two ambulances'),(39,8,8,1,'Diagnostic laboratory'),(40,8,10,1,'Physiotherapy and rehabilitation centre');
/*!40000 ALTER TABLE `hospitalfacility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitalspeciality`
--

DROP TABLE IF EXISTS `hospitalspeciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitalspeciality` (
  `id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `speciality_id` bigint DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `speciality_id` (`speciality_id`),
  CONSTRAINT `hospitalspeciality_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospitalspeciality_ibfk_2` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitalspeciality`
--

LOCK TABLES `hospitalspeciality` WRITE;
/*!40000 ALTER TABLE `hospitalspeciality` DISABLE KEYS */;
INSERT INTO `hospitalspeciality` VALUES (1,1,1,'24 hour cardiac emergency services available'),(2,1,3,'Joint replacement and trauma care available'),(3,1,5,'Dedicated pediatric ward'),(4,2,1,'Advanced cardiac catheterization services'),(5,2,2,'Stroke and neurological emergency unit'),(6,2,6,'Advanced laparoscopic surgery'),(7,3,2,'Neurology and neuro rehabilitation'),(8,3,4,'Skin and cosmetic treatments'),(9,3,7,'Advanced eye surgery'),(10,4,5,'Pediatric emergency services'),(11,4,8,'ENT surgery and hearing care'),(12,4,10,'Maternity and gynecology services'),(13,5,1,'Advanced cardiac surgery'),(14,5,9,'Comprehensive cancer treatment'),(15,5,6,'Robotic and laparoscopic surgery'),(16,6,3,'Sports injury and orthopedic surgery'),(17,6,4,'Dermatology and cosmetic procedures'),(18,6,10,'Gynecology and maternity care'),(19,7,2,'Neurology and stroke treatment'),(20,7,7,'Laser eye procedures'),(21,7,8,'ENT and sinus treatment'),(22,8,3,'Orthopedic trauma treatment'),(23,8,5,'Pediatric outpatient department'),(24,8,6,'General and emergency surgery');
/*!40000 ALTER TABLE `hospitalspeciality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitaltreatment`
--

DROP TABLE IF EXISTS `hospitaltreatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitaltreatment` (
  `id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `treatment_id` bigint DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `treatment_id` (`treatment_id`),
  CONSTRAINT `hospitaltreatment_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hospitaltreatment_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitaltreatment`
--

LOCK TABLES `hospitaltreatment` WRITE;
/*!40000 ALTER TABLE `hospitaltreatment` DISABLE KEYS */;
INSERT INTO `hospitaltreatment` VALUES (1,1,1,180000.00,'Standard angioplasty procedure'),(2,1,2,800.00,'Standard ECG test'),(3,1,3,250000.00,'Knee replacement surgery'),(4,1,4,12000.00,'Basic fracture treatment'),(5,1,7,1500.00,'Child vaccination service'),(6,2,1,220000.00,'Advanced angioplasty procedure'),(7,2,2,1200.00,'ECG with specialist consultation'),(8,2,5,7000.00,'MRI diagnostic scan'),(9,2,8,45000.00,'Laparoscopic appendectomy'),(10,3,5,6500.00,'MRI brain and spine scan'),(11,3,6,2500.00,'Skin allergy diagnosis and treatment'),(12,3,9,55000.00,'Standard cataract surgery'),(13,3,16,85000.00,'Laser vision correction'),(14,4,7,1200.00,'Routine child vaccination'),(15,4,10,1800.00,'Complete hearing assessment'),(16,4,11,35000.00,'Normal delivery package'),(17,4,12,85000.00,'Cesarean delivery package'),(18,5,1,350000.00,'Advanced cardiac intervention'),(19,5,8,60000.00,'Advanced laparoscopic appendectomy'),(20,5,13,75000.00,'Single chemotherapy cycle'),(21,5,14,10000.00,'Comprehensive cancer screening'),(22,6,3,300000.00,'Advanced knee replacement surgery'),(23,6,4,15000.00,'Fracture stabilization and casting'),(24,6,6,3000.00,'Dermatology consultation and treatment'),(25,6,11,40000.00,'Normal delivery package'),(26,6,12,95000.00,'Cesarean section package'),(27,7,5,7500.00,'MRI diagnostic imaging'),(28,7,9,60000.00,'Cataract surgery with premium lens'),(29,7,16,90000.00,'Laser eye surgery'),(30,7,17,40000.00,'Tonsil removal surgery'),(31,8,3,220000.00,'Standard knee replacement'),(32,8,4,10000.00,'Basic fracture treatment'),(33,8,7,1000.00,'Routine vaccination'),(34,8,8,40000.00,'Appendectomy surgery'),(35,8,18,2000.00,'Single physiotherapy session');
/*!40000 ALTER TABLE `hospitaltreatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city_state` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Bathinda, Punjab'),(2,'Ludhiana, Punjab'),(3,'Chandigarh'),(4,'Amritsar, Punjab'),(5,'Delhi'),(6,'Jaipur, Rajasthan'),(7,'Mohali, Punjab'),(8,'Patiala, Punjab');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalequipment`
--

DROP TABLE IF EXISTS `medicalequipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalequipment` (
  `id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `medicalequipment_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalequipment`
--

LOCK TABLES `medicalequipment` WRITE;
/*!40000 ALTER TABLE `medicalequipment` DISABLE KEYS */;
INSERT INTO `medicalequipment` VALUES (1,1,'MRI Machine','Siemens','MAGNETOM Sola',1,'1.5 Tesla MRI scanner'),(2,1,'ECG Machine','Philips','PageWriter TC70',3,'12 lead ECG machines'),(3,1,'Ventilator','Drager','Evita Infinity V500',8,'ICU mechanical ventilators'),(4,2,'MRI Machine','GE Healthcare','SIGNA Explorer',1,'1.5 Tesla MRI system'),(5,2,'CT Scanner','Siemens','SOMATOM go.Up',1,'64 slice CT scanner'),(6,2,'Cardiac Catheterization System','Philips','Azurion 7',1,'Advanced cardiac catheterization lab'),(7,2,'Ventilator','Medtronic','Puritan Bennett 980',15,'Critical care ventilators'),(8,3,'MRI Machine','Philips','Ingenia Ambition',1,'High resolution MRI scanner'),(9,3,'Laser System','Zeiss','VisuMax',1,'Laser eye surgery system'),(10,3,'EEG Machine','Natus','XLTEK',2,'Neurological EEG systems'),(11,4,'Ultrasound Machine','GE Healthcare','Voluson E10',2,'High resolution ultrasound systems'),(12,4,'Ventilator','Drager','Savina 300',10,'ICU and emergency ventilators'),(13,4,'Hearing Analyzer','Interacoustics','Affinity Compact',2,'Audiology testing system'),(14,5,'PET CT Scanner','Siemens','Biograph Vision',1,'Cancer imaging system'),(15,5,'Da Vinci Surgical System','Intuitive','Xi',1,'Robotic surgery system'),(16,5,'Linear Accelerator','Varian','TrueBeam',1,'Radiation therapy system'),(17,5,'MRI Machine','GE Healthcare','SIGNA Premier',2,'3 Tesla MRI scanners'),(18,6,'Arthroscopy System','Stryker','1588 AIM',2,'Orthopedic arthroscopy systems'),(19,6,'Dermatology Laser','Candela','GentleMax Pro',1,'Dermatology and cosmetic laser'),(20,6,'Digital X Ray','Carestream','DRX Evolution',2,'Digital radiography systems'),(21,7,'MRI Machine','Siemens','MAGNETOM Vida',1,'3 Tesla MRI system'),(22,7,'Ophthalmic Laser','Alcon','WaveLight EX500',1,'Laser vision correction system'),(23,7,'ENT Endoscopy System','Karl Storz','IMAGE1 S',2,'High definition ENT endoscopy systems'),(24,8,'Digital X Ray','Fujifilm','FDR Go Plus',2,'Portable digital X ray systems'),(25,8,'Ultrasound Machine','Philips','Affiniti 70',1,'General diagnostic ultrasound'),(26,8,'Physiotherapy Equipment','Chattanooga','Intelect Neo',5,'Electrotherapy and rehabilitation equipment');
/*!40000 ALTER TABLE `medicalequipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `check_rating` CHECK ((`rating` between 0 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,1,'Gurpreet Singh',5,'Good emergency services and helpful doctors.','2026-01-12 10:30:00'),(2,1,'Manpreet Kaur',4,'Overall good experience but waiting time was slightly high.','2026-01-25 14:15:00'),(3,1,'Rohan Kumar',3,'Treatment was good but parking facilities need improvement.','2026-02-02 09:45:00'),(4,2,'Arshdeep Singh',5,'Excellent cardiac treatment and professional staff.','2026-01-08 11:20:00'),(5,2,'Neeraj Sharma',5,'Very good facilities and experienced doctors.','2026-02-14 16:40:00'),(6,2,'Pooja Arora',4,'Good hospital but treatment costs are high.','2026-03-01 12:10:00'),(7,3,'Aditi Gupta',4,'Neurology department was very professional.','2026-01-19 15:00:00'),(8,3,'Karan Verma',5,'Excellent eye treatment and modern equipment.','2026-02-08 10:25:00'),(9,3,'Sahil Jain',4,'Clean hospital and good doctors.','2026-03-05 13:35:00'),(10,4,'Jaspreet Kaur',5,'Very good maternity and child care services.','2026-01-15 08:50:00'),(11,4,'Harjit Singh',4,'Doctors were good and staff was cooperative.','2026-02-20 17:15:00'),(12,5,'Ankit Sharma',5,'World class equipment and highly experienced specialists.','2026-01-10 09:10:00'),(13,5,'Divya Kapoor',4,'Excellent cancer treatment but very expensive.','2026-02-16 11:45:00'),(14,5,'Rahul Mehta',5,'Professional staff and advanced medical technology.','2026-03-10 18:20:00'),(15,6,'Aman Jain',4,'Good orthopedic treatment and clean facilities.','2026-01-28 14:30:00'),(16,6,'Sneha Gupta',5,'Excellent doctors and smooth treatment process.','2026-02-25 10:50:00'),(17,7,'Navdeep Singh',5,'Very good neurological treatment and modern facilities.','2026-01-18 12:30:00'),(18,7,'Ishita Sharma',4,'Eye treatment was excellent but appointment took time.','2026-03-02 09:40:00'),(19,8,'Rajesh Kumar',4,'Affordable treatment and cooperative doctors.','2026-02-10 15:25:00'),(20,8,'Preeti Kaur',3,'Treatment was satisfactory but waiting time was long.','2026-03-12 11:05:00');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speciality`
--

DROP TABLE IF EXISTS `speciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speciality` (
  `id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speciality`
--

LOCK TABLES `speciality` WRITE;
/*!40000 ALTER TABLE `speciality` DISABLE KEYS */;
INSERT INTO `speciality` VALUES (1,'Cardiology','Diagnosis and treatment of heart and cardiovascular conditions'),(2,'Neurology','Diagnosis and treatment of nervous system disorders'),(3,'Orthopedics','Treatment of bones, joints and musculoskeletal conditions'),(4,'Dermatology','Treatment of skin, hair and nail conditions'),(5,'Pediatrics','Medical care for infants, children and adolescents'),(6,'General Surgery','Surgical treatment of common medical conditions'),(7,'Ophthalmology','Diagnosis and treatment of eye conditions'),(8,'ENT','Treatment of ear, nose and throat conditions'),(9,'Oncology','Diagnosis and treatment of cancer'),(10,'Gynecology','Medical and surgical care related to womens reproductive health');
/*!40000 ALTER TABLE `speciality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,'Angioplasty','Procedure to open blocked or narrowed coronary arteries'),(2,'ECG Test','Electrocardiogram used to measure electrical activity of the heart'),(3,'Knee Replacement','Surgical replacement of a damaged knee joint'),(4,'Fracture Treatment','Treatment and stabilization of broken bones'),(5,'MRI Scan','Magnetic resonance imaging diagnostic scan'),(6,'Skin Allergy Treatment','Diagnosis and treatment of allergic skin conditions'),(7,'Child Vaccination','Routine vaccination and immunization for children'),(8,'Appendectomy','Surgical removal of the appendix'),(9,'Cataract Surgery','Surgical removal of cataract from the eye'),(10,'Hearing Test','Diagnostic test to assess hearing ability'),(11,'Normal Delivery','Standard vaginal childbirth procedure'),(12,'Cesarean Section','Surgical childbirth procedure'),(13,'Chemotherapy','Drug treatment used to treat cancer'),(14,'Cancer Screening','Diagnostic screening for early cancer detection'),(15,'Spinal Surgery','Surgical treatment of spinal conditions'),(16,'Laser Eye Surgery','Laser based procedure for vision correction'),(17,'Tonsillectomy','Surgical removal of the tonsils'),(18,'Physiotherapy','Physical rehabilitation and recovery treatment');
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
CREATE TABLE `appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `treatment_id` bigint NOT NULL,
  `hospital_id` bigint DEFAULT NULL,
  `notes` text,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `appointment_treatment_id` (`treatment_id`),
  KEY `appointment_hospital_id` (`hospital_id`),
  CONSTRAINT `appointment_treatment_fk` FOREIGN KEY (`treatment_id`) REFERENCES `treatment` (`id`),
  CONSTRAINT `appointment_hospital_fk` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-18 18:16:26
