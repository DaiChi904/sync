export const throwOnlyInTry = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow throw statement outside of try blocks and nested within catch/finally blocks.",
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
      ThrowStatement(node) {
        let isInsideTryBlock = false;
        let isInsideCatchOrFinally = false;

        // Trace the parent nodes up the AST.
        let current = node.parent;
        while (current) {
          if (current.type === "TryStatement") {
            // Check if the node is within the 'try' block's body.
            if (
              current.block.body.includes(node) ||
              current.block.body.some((child) => child.range[0] <= node.range[0] && child.range[1] >= node.range[1])
            ) {
              isInsideTryBlock = true;
              break; // Found it, no need to go further up.
            }

            // Check if the node is within a 'catch' block.
            if (
              current.handler?.body.body.includes(node) ||
              current.handler.body.body.some(
                (child) => child.range[0] <= node.range[0] && child.range[1] >= node.range[1],
              )
            ) {
              isInsideCatchOrFinally = true;
              break;
            }

            // Check if the node is within a 'finally' block.
            if (
              current.finalizer?.body.includes(node) ||
              current.finalizer.body.some((child) => child.range[0] <= node.range[0] && child.range[1] >= node.range[1])
            ) {
              isInsideCatchOrFinally = true;
              break;
            }
          }
          current = current.parent;
        }

        if (isInsideCatchOrFinally) {
          context.report({ node, messageId: "throwInCatch" });
        } else if (!isInsideTryBlock) {
          context.report({ node, messageId: "throwOutsideTry" });
        }
      },
    };
  },
};
