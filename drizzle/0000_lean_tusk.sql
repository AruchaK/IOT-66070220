CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`student_code` text NOT NULL,
	`birth_date` text NOT NULL,
	`gender` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_code_unique` ON `students` (`student_code`);