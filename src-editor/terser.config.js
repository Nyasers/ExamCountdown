export default {
    ecma: 2025,
    module: true,
    format: {
        comments: false,
    },
    compress: {
        passes: 3,
        arguments: true,
        dead_code: true,
        drop_console: false, // dynamic change when building for production
        // booleans_as_integers: true, // do not use this
        unsafe: true,
        unsafe_arrows: true,
        unsafe_regexp: true,
        unsafe_comps: true,
        unsafe_proto: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_undefined: true,
    },
};