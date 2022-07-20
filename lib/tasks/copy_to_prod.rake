desc 'Copy dev data to prod'
task :copy_to_prod do
	puts 'Copying development game data over to production...'

	`mysqldump war40k_development -uroot --password=password detachment_defs > detachment_defs.sql`
	`mysqldump war40k_development -uroot --password=password models > models.sql`
	`mysqldump war40k_development -uroot --password=password unit_variations > unit_variations.sql`
	`mysqldump war40k_development -uroot --password=password units > units.sql`
	`mysqldump war40k_development -uroot --password=password variation_slots > variation_slots.sql`

	`mysql -uroot --password=password war40k_production < detachment_defs.sql`
	`mysql -uroot --password=password war40k_production < models.sql`
	`mysql -uroot --password=password war40k_production < unit_variations.sql`
	`mysql -uroot --password=password war40k_production < units.sql`
	`mysql -uroot --password=password war40k_production < variation_slots.sql`

	`rm detachment_defs.sql`
	`rm models.sql`
	`rm unit_variations.sql`
	`rm units.sql`
	`rm variation_slots.sql`

	puts 'Complete'
end
