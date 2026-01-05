CREATE TABLE "todos_my_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"note" text NOT NULL,
	"user_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_my_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	CONSTRAINT "users_my_task_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "todos_my_task" ADD CONSTRAINT "todos_my_task_user_id_users_my_task_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_my_task"("id") ON DELETE no action ON UPDATE no action;