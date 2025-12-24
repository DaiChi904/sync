import Flex from "@/components/atoms/Flex";
import Form from "@/components/atoms/Form";
import SecondaryInput from "@/components/atoms/input/SecondaryInput";
import Label from "@/components/atoms/Label";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Typography from "@/components/atoms/Typography";
import SecondaryTextarea from "@/components/atoms/textarea/SecondaryTextarea";
import { SafePending } from "@/components/atoms/utils/SafePending";
import type { Circuit } from "@/domain/model/aggregate/circuit";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";

interface CircuitInfoPanelProps {
  circuit: Circuit | undefined;
  isLoading: boolean;
  isError: boolean;
  changeTitle: (title: CircuitTitle) => void;
  changeDescription: (description: CircuitDescription) => void;
}

export default function CircuitInfoPanel({
  circuit,
  isLoading,
  isError,
  changeTitle,
  changeDescription,
}: CircuitInfoPanelProps) {
  return (
    <SafePending
      data={circuit}
      isLoading={isLoading}
      isError={isError}
      fallback={{
        onLoading: () => <LoadingPuls />,
        onError: () => <Typography>Something went wrong</Typography>,
      }}
    >
      {(circuit) => (
        <Flex direction="column" grow={1} style={{ width: "100%", height: "100%", padding: 10 }}>
          <Typography size="superLarge">Infomation</Typography>
          <Form>
            <Label>
              <Typography size="large">Title</Typography>
              <SecondaryInput
                type="text"
                placeholder="Title"
                value={circuit.title}
                onChange={(ev) => changeTitle(CircuitTitle.from(ev.target.value))}
              />
            </Label>
            <Label>
              <Typography size="large">Description</Typography>
              <SecondaryTextarea
                placeholder="Description"
                value={circuit.description}
                onChange={(ev) => changeDescription(CircuitDescription.from(ev.target.value))}
              />
            </Label>
          </Form>
        </Flex>
      )}
    </SafePending>
  );
}
