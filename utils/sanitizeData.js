exports.sanitizeUserSignup = function (user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email

    };
};

exports.sanitizeUserLogin = function (user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        wishlist: user.wishlist,
        addresses: user.addresses
    }
}