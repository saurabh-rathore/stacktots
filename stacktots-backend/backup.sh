#!/bin/bash

# Database credentials
DB_USER="stacktots"
DB_PASS="your-password"
DB_NAME="stacktots"

# Backup directory
BACKUP_DIR="/path/to/your/backups"

# Timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Backup file
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.sql"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# (Optional) Gzip the backup file
gzip $BACKUP_FILE

# (Optional) Remove old backups (older than 7 days)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
