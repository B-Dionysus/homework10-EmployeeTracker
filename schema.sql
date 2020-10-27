create database homework10;
use homework10;
create table department(id int primary key auto_increment not null, name varchar(30));
create table role(id int primary key auto_increment not null, title varchar(30), salary DECIMAL, department_id int);
create table employee(id int primary key auto_increment not null, first_name varchar(30), last_name varchar(30), role_id int, manager_id int);