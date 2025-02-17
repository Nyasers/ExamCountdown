export default {
    ecma: 2025,
    module: true,
    format: {
        comments: false,
    },
    mangle: {
        reserved: ['ec'],
    },
    compress: {
        passes: 3,
        arguments: true,
        drop_console: false,
        // booleans_as_integers: true,
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