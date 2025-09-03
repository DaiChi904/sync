export const throwOnlyInTry = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow throw statement outside of try, catch, or finally blocks.",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      throwOutsideTry: "Throw statement is not allowed outside of a try block.",
      throwInCatch: "Throw statement is not allowed inside of a catch block.",
      throwInFinally: "Throw statement is not allowed inside of a finally block.",
    },
  },
  create(context) {
    return {
      // Directly invoke the visitor in the ThrowStatement node.
      ThrowStatement(node) {
        let current = node.parent;

        // Trace the parent node to check whether it is within a try/catch/finally block.
        while (current) {
          if (current.type === "TryStatement") {
            // Whether the node is within a try block.
            if (current.block.range <= node.range && node.range <= current.block.range) {
              return; // It's within a try block, so it's fine.
            }
            // Whether the node is within a catch block.
            if (
              current.handler &&
              current.handler.body.range <= node.range &&
              node.range <= current.handler.body.range
            ) {
              context.report({ node, messageId: "throwInCatch" });
              return;
            }
            // Whether the node is within a finally block.
            if (current.finalizer && current.finalizer.range <= node.range && node.range <= current.finalizer.range) {
              context.report({ node, messageId: "throwInFinally" });
              return;
            }
          }
          current = current.parent;
        }

        // If it is not within any try block
        context.report({ node, messageId: "throwOutsideTry" });
      },
    };
  },
};
