import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
  } from "@chakra-ui/react";
  import { LANGUAGE_VERSIONS } from "../constants/Constants";
  
  interface LanguageSelectorProps {
    language: string;
    onSelect: (language: string) => void;
  }
  
  const languages = Object.entries(LANGUAGE_VERSIONS);
  const ACTIVE_COLOR = "blue.400";
  
  const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
    return (
      <Box className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1 font-medium'>
        <Menu isLazy>
          <MenuButton as={Button}>{language}</MenuButton>
          <MenuList className="bg-dark-fill-3 py-2 px-2" zIndex="popover" >
            {languages.map(([lang, version]) => (
              <MenuItem
                key={lang}
                color={lang === language ? ACTIVE_COLOR : ""}
                bg={lang === language ? "gray.900" : "transparent"}
                _hover={{
                  color: ACTIVE_COLOR,
                  bg: "gray.900",
                }}
                onClick={() => onSelect(lang)}
              >
                {lang}
                &nbsp;
                <Text as="span" color="gray.600" fontSize="sm">
                  ({version})
                </Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    );
  };
  
  export default LanguageSelector;
  