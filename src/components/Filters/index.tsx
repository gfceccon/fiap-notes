import { FiltersContainer } from "./styles";

interface FiltersProps {
    children: React.ReactNode;
    handleFilter: (filter: string | null, sortUrgent: boolean | null) => void;
}

function Filters({ handleFilter }: FiltersProps) {

    return (
        <FiltersContainer>
            <label>Filtro</label>
            <input onChange={(e) => handleFilter(e.target.value, null)}></input>
            <label>Ordernar Urgente</label>
            <input
                type={"checkbox"}
                onChange={(e) => handleFilter(null, e.target.checked)}
            ></input>
        </FiltersContainer>
    );
}

export default Filters;
