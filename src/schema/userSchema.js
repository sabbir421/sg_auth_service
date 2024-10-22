const userSchema = {
    Id: {
        type: 'string',
        required: true
    },
    TenantId: {
        type: 'string',
        required: false
    },
    UserName: {
        type: 'string',
        required: true
    },
    NormalizedUserName: {
        type: 'string',
        required: true
    },
    Name: {
        type: 'string',
        required: true
    },
    Surname: {
        type: 'string',
        required: false
    },
    Email: {
        type: 'string',
        required: true
    },
    NormalizedEmail: {
        type: 'string',
        required: true
    },
    EmailConfirmed: {
        type: 'boolean',
        required: true
    },
    PasswordHash: {
        type: 'string',
        required: true
    },
    SecurityStamp: {
        type: 'string',
        required: true
    },
    IsExternal: {
        type: 'boolean',
        required: true
    },
    PhoneNumber: {
        type: 'string',
        required: true
    },
    PhoneNumberConfirmed: {
        type: 'boolean',
        required: true
    },
    IsActive: {
        type: 'boolean',
        required: true
    },
    TwoFactorEnabled: {
        type: 'boolean',
        required: true
    },
    LockoutEnd: {
        type: 'date',
        required: false
    },
    LockoutEnabled: {
        type: 'boolean',
        required: true
    },
    AccessFailedCount: {
        type: 'number',
        required: true
    },
    ShouldChangePasswordOnNextLogin: {
        type: 'boolean',
        required: true
    },
    EntityVersion: {
        type: 'number',
        required: true
    },
    LastPasswordChangeTime: {
        type: 'date',
        required: true
    },
    ExtraProperties: {
        type: 'string',
        required: false
    },
    ConcurrencyStamp: {
        type: 'string',
        required: true
    },
    CreationTime: {
        type: 'date',
        required: true
    },
    CreatorId: {
        type: 'string',
        required: false
    },
    LastModificationTime: {
        type: 'date',
        required: true
    },
    LastModifierId: {
        type: 'string',
        required: false
    },
    IsDeleted: {
        type: 'boolean',
        required: true
    },
    DeleterId: {
        type: 'string',
        required: false
    },
    DeletionTime: {
        type: 'date',
        required: false
    }
};

module.exports = userSchema;
