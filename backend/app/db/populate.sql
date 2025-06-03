drop table if exists documents;

create table documents(
	id_ SERIAL,
	raw_text varchar(400) default null,
	created_at varchar(10) default null,
	primary key (id_)
);

select * from documents;